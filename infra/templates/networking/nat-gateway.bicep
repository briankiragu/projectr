@description('The location where resources will be deployed')
param location string

@description('The name of the public IP for the NAT Gateway')
param publicIpName string

@description('The SKU for the public IP address and NAT Gateway')
param publicIpSkuName string = 'Standard'

@description('The name of the NAT Gateway')
param natGatewayName string

@description('Tags to apply to resources')
param tags object

resource publicIp 'Microsoft.Network/publicIPAddresses@2024-05-01' = {
  location: location
  name: '${publicIpName}-${location}'
  sku: {
    name: publicIpSkuName
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    publicIPAddressVersion: 'IPv4'
  }
  tags: tags
}

resource natGateway 'Microsoft.Network/natGateways@2024-05-01' = {
  name: '${natGatewayName}-${location}'
  location: location
  sku: {
    name: publicIpSkuName
  }
  properties: {
    idleTimeoutInMinutes: 4
    publicIpAddresses: [
      {
        id: publicIp.id
      }
    ]
  }
  tags: tags
}

@description('The ID of the NAT Gateway.')
output id string = natGateway.id

@description('The name of the NAT Gateway.')
output name string = natGateway.name
