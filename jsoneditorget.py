import sys
import time

ourCityFlag  = False
tf           = True

iteratorPad  = 1
jsonFile     = "datastore/businesses.json"

nameDepth    = 0
tfCounter    = 0

cityCount    = 0
nonOurCount  = 0

city         = sys.argv[1]

dataToSendBack   = []
jsonFileHandlerR = open("datastore/businesses.json", 'r')

jsonData     = jsonFileHandlerR.readlines()

# file always properly starts at line 2, or jsonData[1]


for lineCounter in range(len(jsonData) - 1):

    lineCounter = lineCounter + iteratorPad

    # so now we'll grab our line
    currentLine = jsonData[lineCounter]

    if currentLine == '{\n' or currentLine == '}\n':
        continue
    else:
        if ourCityFlag == False:
            currentLine = currentLine[1:]
            # take the line, and find the ":"
            # if it's the last character in the line
            # then we can assume it's a city, and not a business


            if currentLine[len(currentLine) - 2] == ":":
                # it's a city
                cityCount = cityCount + 1

                currentCity = currentLine[2:len(currentLine) - 3]
                # now we want to know if it's the city we want
                if currentCity == city:
                    ourCityFlag = True
                    tf = False
                else:
                    nonOurCount = nonOurCount + 1
            if nonOurCount == cityCount:
                # here we put that there is no one there
                continue
        else:
            # now we're within our city, first we're look for the
            # the end signal (a "}")

            if currentLine == '  }\n' or currentLine == '\t},\n':
                # here we want to know we've ended all city-related
                # logic and also insert our business's details
                ourCityFlag   = False
            elif currentLine == '  {\n' or currentLine == '\t{\n':
                continue
            else:
                dataToSendBack.append(currentLine[1:])

jsonFileHandlerR.close()

textFileHandlerW = open("NPTI.txt", 'w')
textFileHandlerW.writelines(dataToSendBack)
textFileHandlerW.close()

print(dataToSendBack)
