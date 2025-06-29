import pandas as pd

# Load your dataset
df = pd.read_csv("Medicine_Details.csv")

# Rename required columns
df.rename(columns={
    "Medicine Name": "drug_name",
    "Uses": "usage",
    "Side_effects": "side_effects"
}, inplace=True)

# Combine into a description
df["description"] = "Usage: " + df["usage"].fillna('') + ". Side Effects: " + df["side_effects"].fillna('')

# Generate category as the first word of the usage
df["category"] = df["usage"].apply(lambda x: x.split()[0] if isinstance(x, str) else "General")

# Keep only the relevant columns
df_kb = df[["drug_name", "description", "category", "usage"]].dropna()
df_kb.drop_duplicates(inplace=True)

# Save the cleaned dataset
df_kb.to_csv("cleaned_drug_data.csv", index=False)
