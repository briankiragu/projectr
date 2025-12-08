param location string
param name string
param addressPrefix string
param subnets array

@description('Tags to apply to resources')
param tags object

resource vnet 'Microsoft.Network/virtualNetworks@2025-01-01' = {
  location: location
  name: '${name}-${location}'
  properties: {
    addressSpace: {
      addressPrefixes: [addressPrefix]
    }
  }
  tags: tags

  resource vnetSubnets 'subnets' = [
    for subnet in subnets: {
      name: subnet.name
      properties: {
        addressPrefix: subnet.addressPrefix
        natGateway: subnet.natGateway
        delegations: subnet.delegations
      }
    }
  ]
}

output id string = vnet.id
output name string = vnet.name
output subnetIds array = [for (subnet, i) in subnets: vnet::vnetSubnets[i].id]
