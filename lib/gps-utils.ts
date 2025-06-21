// GPS and routing utilities using free APIs

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  })
}

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    )
    const data = await response.json()
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const findNearestAmbulance = (
  emergencyLat: number,
  emergencyLng: number,
  ambulances: Array<{ id: string; lat: number; lng: number; status: string }>,
) => {
  const availableAmbulances = ambulances.filter((amb) => amb.status === "available")

  if (availableAmbulances.length === 0) return null

  let nearest = availableAmbulances[0]
  let minDistance = calculateDistance(emergencyLat, emergencyLng, nearest.lat, nearest.lng)

  for (const ambulance of availableAmbulances) {
    const distance = calculateDistance(emergencyLat, emergencyLng, ambulance.lat, ambulance.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = ambulance
    }
  }

  return { ambulance: nearest, distance: minDistance }
}
