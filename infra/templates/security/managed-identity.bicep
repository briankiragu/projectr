@description('The Azure region where the Managed Identity will be deployed.')
param location string

@description('The name of the Managed Identity.')
param name string

@description('Tags to apply to resources')
param tags object

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2025-01-31-preview' = {
  location: location
  name: '${name}-${location}'
  tags: tags
}

@description('The ID of the Managed Identity.')
output id string = managedIdentity.id

@description('The name of the Managed Identity.')
output name string = managedIdentity.name

@description('The Client ID of the Managed Identity.')
output clientId string = managedIdentity.properties.clientId

@description('The Principal ID of the Managed Identity.')
output principalId string = managedIdentity.properties.principalId
