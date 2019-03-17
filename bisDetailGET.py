import sys
import time

# sub2willNE

ourCityFlag  = False
tf           = True

iteratorPad  = 1
jsonFile     = "datastore/dataStoreBusiness.json"

nameDepth    = 0
tfCounter    = 0

cityCount    = 0
nonOurCount  = 0

businessName     = sys.argv[1]

dataToSendBack   = []
jsonFileHandlerR = open(jsonFile, 'r')

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
                ourCityFlag = True
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
                # some logic to find our specific business

                # remove the two tabs in front of the lines
                ourLine          = currentLine[2:]

                ourNameFormatted = "\"" + businessName + "\""

                lengthOfOurName  = len(ourNameFormatted)

                print(ourLine[:lengthOfOurName])
                print(ourNameFormatted)

                if ourLine[:lengthOfOurName] == ourNameFormatted:
                    lineSplit      = ourLine.split(":")

                    typeValueSplit = lineSplit[1].split("\\")

                    print(typeValueSplit)
                    type  = typeValueSplit[2]
                    value = typeValueSplit[4]

                    dataToSendBack.append(type + ": " + value + "\n")

jsonFileHandlerR.close()

textFileHandlerW = open("NPTIG.txt", 'w')
textFileHandlerW.writelines(dataToSendBack)
textFileHandlerW.close()

print(dataToSendBack)
