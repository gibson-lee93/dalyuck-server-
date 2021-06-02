export const insertIntoOtherCalendar = (userId: number, calendarId: number):string => {
  return `INSERT INTO other_calendar(
    userId,
    calendarName,
    colour,
    description
  )
  VALUES(
    ${userId},
    (SELECT calendarName FROM calendar WHERE calendar.id = ${calendarId}),
    (SELECT colour FROM calendar WHERE calendar.id = ${calendarId}),
    (SELECT description FROM calendar WHERE calendar.id = ${calendarId})
  )`
};

export const insertIntoOtherEvent = (colour: string, otherCalendarId: number, calendarId: number): string => {
  return `INSERT INTO other_event(
    startTime, endTime, eventName, description, access, location, colour, otherCalendarId
  )
  SELECT startTime, endTime, eventName, description, access, location, '${colour}', ${otherCalendarId}
  FROM event
  WHERE event.calendarId = ${calendarId}`
};

export const addTriggerAfterInsertEvent = (userId: number, otherCalendarId: number, calendarId: number, colour: string): string => {
  return `CREATE TRIGGER after_event_insert_${userId}_${otherCalendarId}
  AFTER INSERT
  ON event FOR EACH ROW
  BEGIN
    IF NEW.calendarId = ${calendarId} THEN
      INSERT INTO other_event(startTime, endTime, eventName, description, access, location, colour, otherCalendarId)
      VALUES (new.startTime, new.endTime, new.eventName, new.description, new.access, new.location, '${colour}', ${otherCalendarId});
    END IF;
  END`
};

export const addTriggerAfterUpdateEvent = (userId: number, otherCalendarId: number, calendarId: number): string => {
  return `CREATE TRIGGER after_event_update_${userId}_${otherCalendarId}
  AFTER UPDATE
  ON event FOR EACH ROW
  BEGIN
    IF NEW.calendarId = ${calendarId} THEN
      UPDATE other_event
      SET startTime=new.startTime, endTime=new.endTime, eventName=new.eventName, description=new.description, access=new.access, location=new.location
      WHERE startTime=old.startTime AND endTime=old.endTime;
    END IF;
  END`
};

export const addTriggerAfterDeleteEvent = (userId: number, otherCalendarId: number, calendarId: number): string => {
  return `CREATE TRIGGER after_event_delete_${userId}_${otherCalendarId}
  AFTER DELETE
  ON event FOR EACH ROW
  BEGIN
    IF old.calendarId = ${calendarId} THEN
      DELETE FROM other_event WHERE startTime=old.startTime AND endTime=old.endTime;
    END IF;
  END`
};

export const addTriggerAfterUpdateOtherCalendar = (userId: number, otherCalendarId: number): string => {
  return `CREATE TRIGGER after_other_calendar_update_${userId}_${otherCalendarId}
  AFTER UPDATE
  ON other_calendar FOR EACH ROW
  BEGIN
    IF old.colour <> new.colour THEN
      UPDATE other_event
      SET colour=new.colour
      WHERE otherCalendarId=${otherCalendarId};
    END IF;
  END`
};

export const searchCalendar = (userId: number, keyword: string): string => {
  return `select e.*
  FROM event e
  JOIN calendar c
  ON c.id = e.calendarId AND c.userId  = ${userId}
  WHERE e.eventName LIKE '%${keyword}%' OR e.description LIKE '%${keyword}%'`
}

export const searchOtherCalendar = (userId: number, keyword: string): string => {
  return `select oe.*
  FROM other_event oe
  JOIN other_calendar oc
  ON oc.id = oe.otherCalendarId AND oc.userId  = ${userId}
  WHERE oe.eventName LIKE '%${keyword}%' OR oe.description LIKE '%${keyword}%'`
}

export const searchAttendEvent = (userId: number, keyword: string): string => {
  return `select e.*
  FROM event e
  JOIN user_event ue
  ON ue.eventId = e.id AND ue.userId  = ${userId}
  WHERE e.eventName LIKE '%${keyword}%' OR e.description LIKE '%${keyword}%'`
}

export const insertHolidayCalendar = (userId: number): string => {
  return `INSERT INTO other_calendar (calendarName, description, colour, userId)
  SELECT calendarName, description, colour, ${userId}
  FROM other_calendar
  WHERE id=1;`
}

export const insertHolidayEvent = (otherCalendarId: number): string => {
  return `INSERT INTO other_event (eventName, description, colour, location, startTime, endTime, otherCalendarId)
  SELECT eventName, description, colour, location, startTime, endTime, ${otherCalendarId}
  FROM other_event
  WHERE otherCalendarId=1;`
}
