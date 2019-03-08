import os
import sys
import time

# sub2pewdiepie

ourCityFlag  = False
tf           = True

iteratorPad  = 1
jsonFile     = "datastore/dataStoreBusiness.json"

nameDepth    = 0
tfCounter    = 0

cityCount    = 0
nonOurCount  = 0

insertionData   = []

city            = sys.argv[1]
businessDetails = sys.argv[2]
businessRating  = sys.argv[3]
businessEmailN  = sys.argv[4]
businessEmailD  = sys.argv[5]
businessPhone   = sys.argv[6]
businessName    = sys.argv[7]

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
                    braces   = "\t{\n\t},\n"

                    citySnip = [cityName, braces]

                    backupp = jsonData[:1]
                    backupf = jsonData[1:]

                    actualData = backupp + citySnip + backupf

                    jsonFileHandlerW = open(jsonFile, 'w')

                    jsonFileHandlerW.writelines(actualData)

                    jsonFileHandlerW.close()

                    command = "python3 bisDetailPush.py " + city + " " + businessDetails + " " + businessRating + " " + businessEmailN + " " + businessEmailD + " " + businessPhone + " " + businessName;
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

                testing = []

                if jsonData[editLine] != '\t{\n':
                    ouredit = jsonData[editLine][:-1]

                    ouredit = ouredit + ",\n"

                    jsonData[editLine] = ouredit

                businessDeets   = "\"" + "DETAIL\\" + businessDetails +"\",\n"
                BDID            = "\t\t\"" + businessName + "\": " + businessDeets

                businessRat     = "\"" + "RATING\\" + businessRating +"\",\n"
                BRID            = "\t\t\"" + businessName + "\": " + businessRat

                businessEmail   = "\"" + "EMAIL\\" + businessEmailN + "@" + businessEmailD +"\",\n"
                BEID            = "\t\t\"" + businessName + "\": " + businessEmail

                businessPhoneP  = "\"" + "PHONE\\" + businessPhone +"\"\n"
                BPID            = "\t\t\"" + businessName + "\": " + businessPhoneP

                insertionData   = BDID + BRID + BEID + BPID

                testing.append(BDID)
                testing.append(BRID)
                testing.append(BEID)
                testing.append(BPID[:-1] + ",\n")

                try:
                    if jsonData[insertionLine-4:insertionLine] == testing:
                        # we don't want irregular duplicates as it will screw with storage capacity
                        # will also look at creating a python script to validate all json files and remove duplicates
                        cont = True
                    else:
                        backupp = jsonData[:insertionLine]
                        backupf = jsonData[insertionLine:]

                        newData = backupp

                        jsonFileHandlerW = open("datastore/dataStoreBusiness.json", 'w')

                        newData.append(insertionData)

                        newData = newData + backupf

                        jsonFileHandlerW.writelines(newData)

                        jsonFileHandlerW.close()

                        tfCounter = tfCounter + 1
                except IndexError:
                    backupp = jsonData[:insertionLine]
                    backupf = jsonData[insertionLine:]

                    newData = backupp

                    jsonFileHandlerW = open("datastore/dataStoreBusiness.json", 'w')

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
