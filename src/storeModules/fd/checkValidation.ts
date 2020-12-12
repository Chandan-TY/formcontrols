export function checkPropertyValue (propertyName: keyof controlProperties, value: any) : boolean {
  let result = true
  switch (propertyName) {
    case 'Left':
    case 'Top':
      result = value > -32767 && value <= 32767
      break
    case 'Width':
    case 'Height':
      result = value >= 0 && value <= 32767
      break
    case 'ListRows':
    case 'MaxLength':
      result = value >= 0 && value < 2147483647
      break
    case 'TabFixedHeight':
    case 'TabFixedWidth':
      result = value >= 0 && value < 7200
      break
    case 'Zoom':
      result = value >= 10 && value < 401
      break
    case 'BoundColumn':
      result = value >= 0 && value <= 65535
      break
    case 'ColumnCount':
      result = value >= -1 && value < 2147483647
      break
    case 'TextColumn':
      result = value >= -1 && value <= 32767
      break
  }
  return result
}
