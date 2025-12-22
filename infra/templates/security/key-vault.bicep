param location string
param name string
param logAnalyticsWorkspaceId string
param managedIdentityPrincipalId string

@description('When true, create RBAC role assignments on the Key Vault for the managed identity. Requires roleAssignments/write permissions for the deploying identity.')
param createRoleAssignments bool = false

@description('Tags to apply to resources')
param tags object

// Key Vault naming constraints:
// - 3-24 characters
// - alphanumeric only
// - must start with a letter
// Key Vault names are globally unique, so append a deterministic suffix.
var kvBaseName = toLower(replace(replace(name, '-', ''), '_', ''))
var kvSuffix = uniqueString(resourceGroup().id, name)
var keyVaultName = take('${kvBaseName}${kvSuffix}', 24)

resource keyVault 'Microsoft.KeyVault/vaults@2025-05-01' = {
  location: location
  name: '${name}kv${location}'
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true // Use RBAC instead of access policies
    enabledForDeployment: false
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
  }
  tags: tags
}

// Assign Key Vault Secrets User role to the managed identity
resource secretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (createRoleAssignments) {
  name: guid(keyVault.id, managedIdentityPrincipalId, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6'
    ) // Key Vault Secrets User
    principalId: managedIdentityPrincipalId
    principalType: 'ServicePrincipal'
  }
}

resource kvDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${keyVaultName}-diagnostics'
  scope: keyVault
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
      {
        category: 'AzurePolicyEvaluationDetails'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

output id string = keyVault.id
output name string = keyVault.name
output vaultUri string = keyVault.properties.vaultUri
