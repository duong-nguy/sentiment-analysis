import tensorflow as tf
import pandas as pd
import sys


def main():
    if len(sys.argv) == 2:
        file_path = sys.argv[1]
        df = pd.read_csv(file_path,na_values="NaN",index_col="ID")
        model = tf.saved_model.load("../python/sentiment")
        df["sentiment"] = df.apply(
            lambda x: int(model([x["comment"]]).numpy()[0][0]*10),
            axis=1)
        df.to_csv(file_path)
        print("***Finish***")
if __name__ == "__main__":
    main()
