# Plotting configuration used by the API
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend suitable for servers

import matplotlib.pyplot as plt
import seaborn as sns

plt.style.use('dark_background')
sns.set_theme(style="darkgrid")
