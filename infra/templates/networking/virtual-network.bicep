@description('The Azure region where the Virtual Network will be deployed.')
param location string

@description('The name of the Virtual Network.')
param name string

@description('The address prefix for the Virtual Network.')
param addressPrefix string

@description('The subnets to create in the Virtual Network.')
param subnets array

@description('Tags to apply to resources')
param tags object

resource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {
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

@description('The ID of the Virtual Network.')
output id string = vnet.id

@description('The name of the Virtual Network.')
output name string = vnet.name

@description('The IDs of the subnets created in the Virtual Network.')
output subnetIds array = [for (subnet, i) in subnets: vnet::vnetSubnets[i].id]
