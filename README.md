# Fluent - Data Analysis & Function Generation

Transform your data into mathematical functions with high accuracy using advanced polynomial regression and machine learning techniques.

## Features

- **Multi-format Support**: Upload CSV, XLSX, or JSON files
- **Manual Data Input**: Enter data points directly in the interface
- **Automatic Function Generation**: Generate polynomial and linear functions with high accuracy
- **Data Visualization**: Interactive charts and graphs for your data
- **LaTeX Export**: Download comprehensive reports in LaTeX format
- **Prediction Engine**: Use generated functions to predict new values

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **scikit-learn**: Machine learning and polynomial regression
- **pandas**: Data manipulation and analysis
- **matplotlib & seaborn**: Data visualization
- **numpy**: Numerical computations

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization library

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn package manager

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fluent
```

### 2. Setup
On Windows
```bash
.\start-fluent.bat 
```
On Linux
```bash
chmod +x start-fluent.sh
.\start-fluent
```

The backend API will be available at `http://localhost:8000`
The frontend will be available at `http://localhost:3000`

## Usage

### File Upload
1. Navigate to the **File Upload** tab
2. Drag and drop your CSV, XLSX, or JSON file
3. Select X and Y columns from the numeric columns
4. Click **Analyze Data** to generate the mathematical function

### Manual Input
1. Navigate to the **Manual Input** tab
2. Enter your data points in the X and Y fields
3. For multi-dimensional data, separate X values with commas (e.g., "1,2,3")
4. Click **Analyze Data** to generate the function

### Results
- View the generated mathematical function with accuracy percentage
- Explore data visualization charts
- Use the prediction tool to forecast new values
- Download LaTeX reports for documentation

## API Endpoints

### Core Endpoints
- `POST /upload-file` - Upload and validate data files
- `POST /analyze-data` - Analyze uploaded file data
- `POST /analyze-manual` - Analyze manually input data
- `POST /predict` - Make predictions using generated models
- `POST /generate-latex` - Generate LaTeX documentation

## Mathematical Functions

Fluent automatically determines the best mathematical model for your data:

### Single Variable Functions
- **Linear**: `f(x) = ax + b`
- **Quadratic**: `f(x) = ax² + bx + c`
- **Cubic**: `f(x) = ax³ + bx² + cx + d`

### Multi-Variable Functions
- **Linear**: `f(x) = a₁x₁ + a₂x₂ + ... + aₙxₙ + b`

The system automatically selects the optimal degree based on data characteristics and validation scores.