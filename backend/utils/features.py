from typing import List, Optional


def expand_with_feature_names(base_values: List[float], feature_names: Optional[List[str]]) -> List[float]:
    if not feature_names:
        return base_values
    # Determine order of base variables from feature_names
    base_vars: List[str] = []
    for name in feature_names:
        if ('*' not in name) and ('^' not in name):
            if name not in base_vars:
                base_vars.append(name)
    # Map variable -> value using position order
    var_to_value = {}
    for idx, var in enumerate(base_vars):
        if idx < len(base_values):
            var_to_value[var] = float(base_values[idx])
    # Build expanded vector matching feature_names order
    expanded: List[float] = []
    for name in feature_names:
        if ('*' not in name) and ('^' not in name):
            expanded.append(float(var_to_value.get(name, 0.0)))
            continue
        # Handle powers and interactions
        product = 1.0
        for factor in name.split('*'):
            if '^' in factor:
                var, p_str = factor.split('^', 1)
                try:
                    power = int(p_str)
                except Exception:
                    power = 1
            else:
                var = factor
                power = 1
            base_val = float(var_to_value.get(var, 0.0))
            product *= (base_val ** power)
        expanded.append(product)
    return expanded
