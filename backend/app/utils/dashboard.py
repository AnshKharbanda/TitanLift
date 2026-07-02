from datetime import date, timedelta


def calculate_streak(start_date:date,workout_dates:set[date])->int:
    current_date=start_date
    streak=0

    while current_date in workout_dates:
        streak+=1
        current_date-=timedelta(days=1)

    return streak

def calculate_longest_streak(dates:set[date])->int:   
    if not dates:
        return 0
     
    dates=sorted(dates)
    
    current_streak=1
    longest_streak=1
    
    for i in range(1,len(dates)):
        previous_day=dates[i-1]
        current_day=dates[i]
        
        if current_day-timedelta(days=1)==previous_day:
            current_streak+=1
        else :
            current_streak=1
        longest_streak=max(current_streak,longest_streak)

    
    return longest_streak
    