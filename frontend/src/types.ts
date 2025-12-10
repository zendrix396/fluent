export interface AnalysisResult {
  function: string
  accuracy: string
  visualization: string
  data_points: number
  x_column?: string
  y_column?: string
  model?: {
    feature_names?: string[]
    target_names?: string[]
    coefficients?: number[]
    intercepts?: number[]
    intercept?: number
    is_polynomial?: boolean
    degree?: number
    multi_output?: boolean
    model_id?: string
  }
  functions?: string[]
  accuracies?: number[]
  filename?: string
  target_visualizations?: Array<{
    target: string
    image: string
  }>
}

