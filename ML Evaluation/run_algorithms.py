#!/usr/bin/python

import time
import sklearn


def calculate_metrics(Y_test, Y_predicted):

    from sklearn import metrics
    from sklearn.metrics import classification_report, confusion_matrix

    # accuracy = metrics.accuracy_score(Y_test, Y_predicted)
    # print("\naccuracy = " + str(round(accuracy * 100, 2)) + "%\n")

    confusion_mat = confusion_matrix(Y_test, Y_predicted)

    print("\nconfusion matrix =")
    print(confusion_mat)
    print("matrix size =", (confusion_mat.shape))

    print("\nTP\tFP\tFN\tTN\t\tSensitivity\tSpecificity")
    for i in range(confusion_mat.shape[0]):
        # i means which class to choose to do one-vs-the-rest calculation
        # rows are actual obs whereas columns are predictions
        TP = round(float(confusion_mat[i, i]), 2)  # correctly labeled as i
        # incorrectly labeled as i
        FP = round(float(confusion_mat[:, i].sum()), 2) - TP
        # incorrectly labeled as non-i
        FN = round(float(confusion_mat[i, :].sum()), 2) - TP
        TN = round(float(confusion_mat.sum().sum()), 2) - TP - FP - FN
        sensitivity = round(TP / (TP + FN), 2)
        specificity = round(TN / (TN + FP), 2)
        print(str(TP)+"\t"+str(FP)+"\t"+str(FN)+"\t"+str(TN) +
              "\t\t"+str(sensitivity)+"\t\t"+str(specificity))

    # precision = metrics.precision_score(Y_test, Y_predicted)
    # recall = metrics.recall_score(Y_test, Y_predicted)
    # f_score = metrics.f1_score(Y_test, Y_predicted)
    # print("\nprecision = %.3f" % (precision))
    # print("recall = %.3f" % (recall))
    # print("f_score = %.3f" % (f_score) + "\n")
    report = classification_report(Y_test, Y_predicted)
    print("\n" + report)


def neural_network(dataset, class_labels, test_size):

    import numpy as np
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.neural_network import MLPClassifier

    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=test_size, random_state=42)

    model = MLPClassifier(hidden_layer_sizes=(
        100), activation='logistic', random_state=42)
    model.fit(X_train, Y_train.values.ravel())
    Y_predicted = model.predict(X_test)

    return Y_test, Y_predicted


def random_forests(dataset, class_labels, test_size):

    import numpy as np
    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier

    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=test_size, random_state=42)
    model = RandomForestClassifier(
        n_estimators=5, criterion='entropy', random_state=42)
    model.fit(X_train, Y_train.values.ravel())
    Y_predicted = model.predict(X_test)

    return Y_test, Y_predicted


def support_vector_machines(dataset, class_labels, test_size):

    import numpy as np
    from sklearn import svm
    import pandas as pd
    from sklearn.model_selection import train_test_split

    X = pd.read_csv(dataset)
    Y = pd.read_csv(class_labels)
    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=test_size, random_state=42)
    # 'rbf' value is the gaussian kernel, 'C' is the coefficient used for regularization during training
    model = svm.SVC(kernel='rbf', C=2.0)
    model.fit(X_train, Y_train.values.ravel())
    Y_predicted = model.predict(X_test)

    return Y_test, Y_predicted


def main():

    dataset = "ML Evaluation/Dataset.csv"
    class_labels = "ML Evaluation/Target_Labels.csv"
    test_size = 0.3

    print("\n\n#running Neural Networks...")
    start_time = time.time()
    Y_test, Y_predicted = neural_network(dataset, class_labels, test_size)
    calculate_metrics(Y_test, Y_predicted)
    end_time = time.time()
    print("runtime = %.3f" % (end_time - start_time)+" seconds")

    print("\n\n#running Random Forests...")
    start_time = time.time()
    Y_test, Y_predicted = random_forests(dataset, class_labels, test_size)
    calculate_metrics(Y_test, Y_predicted)
    end_time = time.time()
    print("runtime = %.3f" % (end_time - start_time)+" seconds")

    print("\n\n#running Support Vector Machines...")
    start_time = time.time()
    Y_test, Y_predicted = support_vector_machines(
        dataset, class_labels, test_size)
    calculate_metrics(Y_test, Y_predicted)
    end_time = time.time()
    print("runtime = %.3f" % (end_time - start_time)+" seconds")


if __name__ == '__main__':
    start_time = time.time()
    main()
    end_time = time.time()
    print("\nTotal runtime = %.3f" % (end_time - start_time)+" seconds\n")
