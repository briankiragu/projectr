param location string
param name string

@description('Tags to apply to resources')
param tags object

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2025-01-31-preview' = {
  location: location
  name: '${name}-${location}'
  tags: tags
}

output id string = managedIdentity.id
output name string = managedIdentity.name
output clientId string = managedIdentity.properties.clientId
output principalId string = managedIdentity.properties.principalId
