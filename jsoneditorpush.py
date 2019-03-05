import sys
import os
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
businessName = sys.argv[2]
businessLat  = sys.argv[3]
businessLong = sys.argv[4]

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
            if tfCounter == 0:
                if nonOurCount == cityCount:
                    cityName = "  \"" + city + "\":\n"
                    braces   = "\t{\n\t}\,\n"

                    citySnip = [cityName, braces]

                    backupp = jsonData[:1]
                    backupf = jsonData[1:]

                    actualData = backupp + citySnip + backupf

                    jsonFileHandlerW = open("datastore/businesses.json", 'w')

                    jsonFileHandlerW.writelines(actualData)

                    jsonFileHandlerW.close()

                    command = "python3 jsoneditorpush.py " + city + " " + businessName + " " + businessLat + " " + businessLong
                    os.system(command)

                    tf = False
        else:
            # now we're within our city, first we're look for the
            # the end signal (a "}")

            if currentLine == '  }\n' or currentLine == '\t},\n':
                # here we want to know we've ended all city-related
                # logic and also insert our business's details
                ourCityFlag   = False

                # two values we need to calculate:
                # 1. insertion line
                # 2. last entry (as we need to add a "," at the end)
                insertionLine = refrenceMarker + nameDepth
                editLine      = insertionLine  - 1

                if jsonData[editLine] != '\t{\n':
                    ouredit = jsonData[editLine][:-1]

                    ouredit = ouredit + ",\n"

                    jsonData[editLine] = ouredit

                businessLOA   = "\"" + businessLat + "\\" + businessLong + "\"\n"
                insertionData = "\t\t\"" + businessName + "\": " + businessLOA

                backupp = jsonData[:insertionLine]
                backupf = jsonData[insertionLine:]

                newData = backupp

                jsonFileHandlerW = open("datastore/businesses.json", 'w')

                newData.append(insertionData)

                newData = newData + backupf

                jsonFileHandlerW.writelines(newData)

                jsonFileHandlerW.close()

                tfCounter = tfCounter + 1


            elif currentLine == '  {\n' or currentLine == '\t{\n':
                # here we'll use this "{" marker as a refrence
                # point for where we should insert our details
                #
                # i.e if "{" is on line 3 and we have a nameDepth of 2
                # then we'll calculate "line (1+3+2) = line 6"
                # (the 1 to act as a buffer, as line 5 will be the last entry)
                # and we'll insert there

                refrenceMarker = lineCounter + 1        # the 1 here acts as the
                                                        # buffer
            else:
                # so here we've landed a "business name: co-ordinate" line
                nameDepth = nameDepth + 1

jsonFileHandlerR.close()
