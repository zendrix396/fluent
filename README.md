# Fluent - Data Analysis & Function Generation

Transform your data into mathematical functions with high accuracy using advanced polynomial regression and machine learning techniques.

## 🚀 Features

- **Multi-format Support**: Upload CSV, XLSX, or JSON files
- **Manual Data Input**: Enter data points directly in the interface
- **Automatic Function Generation**: Generate polynomial and linear functions with high accuracy
- **Data Visualization**: Interactive charts and graphs for your data
- **LaTeX Export**: Download comprehensive reports in LaTeX format
- **Prediction Engine**: Use generated functions to predict new values
- **Dark Theme**: Modern, eye-friendly interface
- **Real-time Analysis**: Fast processing with immediate results

## 🛠 Tech Stack

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

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fluent
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📊 Usage

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

## 🔧 API Endpoints

### Core Endpoints
- `POST /upload-file` - Upload and validate data files
- `POST /analyze-data` - Analyze uploaded file data
- `POST /analyze-manual` - Analyze manually input data
- `POST /predict` - Make predictions using generated models
- `POST /generate-latex` - Generate LaTeX documentation

### Example API Usage

```python
import requests

# Upload and analyze a file
with open('data.csv', 'rb') as f:
    files = {'file': f}
    data = {'x_column': 'feature', 'y_column': 'target'}
    response = requests.post('http://localhost:8000/analyze-data', files=files, data=data)
    result = response.json()
    print(f"Function: {result['function']}")
    print(f"Accuracy: {result['accuracy']}")
```

## 🧮 Mathematical Functions

Fluent automatically determines the best mathematical model for your data:

### Single Variable Functions
- **Linear**: `f(x) = ax + b`
- **Quadratic**: `f(x) = ax² + bx + c`
- **Cubic**: `f(x) = ax³ + bx² + cx + d`

### Multi-Variable Functions
- **Linear**: `f(x) = a₁x₁ + a₂x₂ + ... + aₙxₙ + b`

The system automatically selects the optimal degree based on data characteristics and validation scores.

## 📁 Project Structure

```
fluent/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── sklearn_fluent.py    # ML function generation
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── file-upload.tsx  # File upload component
│   │   ├── manual-input.tsx # Manual input component
│   │   └── analysis-results.tsx # Results display
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── package.json         # Node.js dependencies
└── README.md
```

## 🔍 Example Data Formats

### CSV Example
```csv
x,y
1,3
2,7
3,13
4,21
5,31
```

### JSON Example
```json
[
  {"x": 1, "y": 3},
  {"x": 2, "y": 7},
  {"x": 3, "y": 13},
  {"x": 4, "y": 21},
  {"x": 5, "y": 31}
]
```

### Multi-dimensional Input
For manual input with multiple X variables:
- X: `1,2,3` Y: `7`
- X: `2,3,4` Y: `14`
- X: `3,4,5` Y: `21`

## 🎨 Customization

### Theme Configuration
The application supports both light and dark themes. Modify `frontend/app/globals.css` to customize colors:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other color variables */
}
```

### API Configuration
Update the API base URL in frontend components:
```typescript
const API_BASE_URL = 'http://localhost:8000'
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes your frontend URL
2. **File Upload Failures**: Check file format and size limits
3. **Analysis Errors**: Verify data has sufficient numeric columns and data points
4. **Prediction Errors**: Ensure input format matches the original data structure

### Development

```bash
# Backend development with auto-reload
cd backend
uvicorn main:app --reload

# Frontend development with hot reload
cd frontend
npm run dev
```

## 📈 Performance

- **File Processing**: Handles files up to 100MB
- **Data Points**: Optimized for datasets with 2-10,000 data points
- **Analysis Speed**: Typical analysis completes in 1-5 seconds
- **Accuracy**: Achieves 95%+ accuracy on well-structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [scikit-learn](https://scikit-learn.org/) for machine learning capabilities
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Visualization powered by [matplotlib](https://matplotlib.org/) and [seaborn](https://seaborn.pydata.org/)
- Frontend framework [Next.js](https://nextjs.org/)

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the troubleshooting section above

---

**Fluent** - Transforming data into mathematical insights with precision and ease.
