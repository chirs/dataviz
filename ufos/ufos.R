download.file("https://raw.githubusercontent.com/planetsig/ufo-reports/master/csv-data/ufo-scrubbed-geocoded-time-standardized.csv",
              "~/Downloads/UFOdata.csv","curl")
ufos <- read.csv("~/Downloads/UFOdata.csv",stringsAsFactors = F)
ufos <- data.table(ufos)
setnames(ufos,c("date","city","state","country","shape","seconds","duration","description","date_added","lat","lon"))
ufos[,newDate := as.Date(date)]
ufos[,lat := as.numeric(lat)]
export <- toJSON(ufos[,.(newDate,shape,seconds,lat,lon)]) #description
write(export,"~/Desktop/RC/ufos/ufos.json")
