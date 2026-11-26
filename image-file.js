// Make a browser-sized copy for the avatar or banner, without changing the uploaded file.
async function preparePhoto(source, {maxSize = 1400, square = false, keepAlpha = false} = {}) {
  const fileUrl = source instanceof Blob ? URL.createObjectURL(source) : ''
  const image = new Image()
  try {
    image.src = fileUrl || source
    await image.decode()
    const {naturalWidth: width, naturalHeight: height} = image
    const shortSide = Math.min(width, height)
    const cropWidth = square ? shortSide : width
    const cropHeight = square ? shortSide : height
    const scale = Math.min(1, maxSize / Math.max(cropWidth, cropHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(cropWidth * scale))
    canvas.height = Math.max(1, Math.round(cropHeight * scale))
    const context = canvas.getContext('2d')
    if (!keepAlpha) {
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
    context.drawImage(image, (width - cropWidth) / 2, (height - cropHeight) / 2,
      cropWidth, cropHeight, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/webp', 0.85)
  } finally {
    if (fileUrl) URL.revokeObjectURL(fileUrl)
  }
}
