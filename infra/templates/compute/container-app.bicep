// Basic configuration
@description('The Azure region where the Container App will be deployed.')
param location string

@description('The name of the Container App.')
param name string

@description('Tags to apply to resources')
param tags object

// Environment and identity
@description('The ID of the Container Apps Environment.')
param containerAppEnvironmentId string

@description('The ID of the User Assigned Identity.')
param userAssignedIdentityId string

// Container configuration
@description('The container image to deploy.')
param image string

@description('Environment variables for the container.')
param env array = []

@description('Secrets for the container.')
param secrets array = []

// Ingress configuration
@description('The target port for the container.')
param targetPort int = 0

@description('Whether to enable external ingress.')
param externalIngress bool = false

@description('The transport type for ingress.')
param transport string = 'auto'

// Storage configuration
@description('Volume mounts for the container.')
param volumeMounts array = []

@description('Volumes for the container.')
param volumes array = []

// Monitoring
@description('The ID of the Log Analytics Workspace.')
param logAnalyticsWorkspaceId string

resource containerApp 'Microsoft.App/containerApps@2025-10-02-preview' = {
  location: location
  name: name
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

@description('The ID of the Container App.')
output id string = containerApp.id

@description('The name of the Container App.')
output name string = containerApp.name

@description('The FQDN of the Container App.')
output fqdn string = targetPort > 0 ? containerApp.properties.configuration.ingress.fqdn : ''
