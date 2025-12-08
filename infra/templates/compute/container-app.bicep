// Basic configuration
param location string
param name string

@description('Tags to apply to resources')
param tags object

// Environment and identity
param containerAppEnvironmentId string
param userAssignedIdentityId string

// Container configuration
param image string
param env array = []
param secrets array = []

// Ingress configuration
param targetPort int = 0
param externalIngress bool = false
param transport string = 'auto'

// Storage configuration
param volumeMounts array = []
param volumes array = []

// Monitoring
param logAnalyticsWorkspaceId string

resource containerApp 'Microsoft.App/containerApps@2025-10-02-preview' = {
  location: location
  name: '${name}-${location}'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
  properties: {
    environmentId: containerAppEnvironmentId
    configuration: {
      ingress: targetPort > 0 ? { external: externalIngress, targetPort: targetPort, transport: transport } : null
      secrets: secrets
    }
    template: {
      containers: [
        { name: name, image: image, env: env, volumeMounts: volumeMounts }
      ]
      volumes: volumes
    }
  }
  tags: tags
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${containerApp.name}-diagnostics'
  scope: containerApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        category: 'ContainerAppConsoleLogs'
        enabled: true
      }
      {
        category: 'ContainerAppSystemLogs'
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

output id string = containerApp.id
output name string = containerApp.name
output fqdn string = targetPort > 0 ? containerApp.properties.configuration.ingress.fqdn : ''
