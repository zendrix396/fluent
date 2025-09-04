from typing import List, Optional, Union, Any
from pydantic import BaseModel


class DataPoint(BaseModel):
    x: Union[float, List[float]]
    y: float


class ManualDataInput(BaseModel):
    data_points: List[DataPoint]
    target_column: Optional[str] = "y"


class PredictionRequest(BaseModel):
    x_values: Union[List[float], List[List[float]]]
    model_equation: Optional[str] = None
    coefficients: Any
    intercept: Any
    is_polynomial: Optional[bool] = False
    degree: Optional[int] = 1
    multi_output: Optional[bool] = False
    feature_names: Optional[List[str]] = None
    model_id: Optional[str] = None
