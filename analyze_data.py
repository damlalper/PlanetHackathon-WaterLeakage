
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('water_leak_data/water_leak_detection_1000_rows.csv')

# Display the first few rows of the dataframe
print(df.head())

# Get a summary of the dataframe
print(df.info())

# Get descriptive statistics
print(df.describe())

# Check for missing values
print(df.isnull().sum())

# Visualize the distribution of 'Leak Status'
sns.countplot(x='Leak Status', data=df)
plt.title('Distribution of Leak Status')
plt.show()

# Visualize the distribution of 'Burst Status'
sns.countplot(x='Burst Status', data=df)
plt.title('Distribution of Burst Status')
plt.show()

# Pairplot to see relationships between variables
sns.pairplot(df, hue='Leak Status')
plt.show()
