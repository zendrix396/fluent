# Frontend Configuration System

This document explains how to configure the frontend to connect to different backend servers.

## Configuration File

The frontend uses a `config.json` file located in the `frontend/public/` directory to store configuration settings.

### File Location
```
frontend/public/config.json
```

### Configuration Structure
```json
{
  "backend": {
    "baseUrl": "http://localhost:8000"
  }
}
```

## How to Change the Backend URL

### Method 1: Edit config.json directly
1. Open `frontend/public/config.json`
2. Change the `baseUrl` value to your desired backend server URL
3. Save the file
4. Restart the frontend development server

### Method 2: Use the Configuration Manager (if implemented)
1. Open the frontend application
2. Navigate to the configuration section
3. Click "Edit" next to the Backend Server URL
4. Enter the new URL
5. Click "Save"

## Examples

### Local Development
```json
{
  "backend": {
    "baseUrl": "http://localhost:8000"
  }
}
```

### Production Server
```json
{
  "backend": {
    "baseUrl": "https://your-production-server.com"
  }
}
```

### Custom Port
```json
{
  "backend": {
    "baseUrl": "http://localhost:3000"
  }
}
```

## Technical Details

### Configuration Loading
- The configuration is loaded when the application starts
- If the config file cannot be loaded, it falls back to the default URL (`http://localhost:8000`)
- The configuration is cached and can be reloaded using the `reload()` function

### Components Using Configuration
- `FileUpload` - Uploads files to the backend
- `AnalysisResults` - Makes predictions and downloads reports
- `ManualInput` - Analyzes manually entered data

### Files Involved
- `frontend/public/config.json` - Configuration file
- `frontend/lib/config.ts` - Configuration utility functions
- `frontend/hooks/use-config.ts` - React hook for configuration
- `frontend/components/config-manager.tsx` - UI component for managing configuration

## Troubleshooting

### Configuration Not Loading
1. Ensure `config.json` exists in the `frontend/public/` directory
2. Check that the JSON syntax is valid
3. Verify the file permissions allow reading

### Backend Connection Issues
1. Verify the backend server is running
2. Check that the URL in `config.json` is correct
3. Ensure there are no CORS issues between frontend and backend
4. Check the browser console for error messages

### Development vs Production
- For development: Use `http://localhost:8000`
- For production: Use your production server URL
- Make sure to update the configuration when deploying to different environments
