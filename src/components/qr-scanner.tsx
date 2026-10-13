'use client'

import { useEffect, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
}

export default function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("workshop-qr-reader")

    html5QrCode.start(
      { facingMode: "environment" }, // Forces back camera on mobile
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },
      (decodedText) => {
        // Stop scanning immediately on successful read to prevent duplicate triggers
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => {
            onScanSuccess(decodedText)
          }).catch((err) => console.error("Failed to stop scanner", err))
        }
      },
      (errorMessage) => {
        // We ignore frame-by-frame read errors to keep the console clean
      }
    ).catch((err) => {
      setError("Camera permission denied or unsupported device.")
      console.error(err)
    })

    // Cleanup when component unmounts
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error)
      }
    }
  }, [onScanSuccess])

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div 
        id="workshop-qr-reader" 
        className="w-full overflow-hidden rounded-sm border-2 border-primary bg-gray-50/50 shadow-sm"
      ></div>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      <p className="mt-4 text-sm text-secondary">Align the Universal Session QR within the frame.</p>
    </div>
  )
}