export const extractValue = (message: string): string | null => {
  const regex = /'([^']+)'/;
  const match = regex.exec(message);

  if (!match || match.length <= 1) {
    return null;
  }

  return match[1];
};

export const extractField = (
  sql: string,
  value: string | null,
): string | null => {
  const valuesRegex = /VALUES\s*\((.*)\)/;
  const fieldsRegex = /`([^`]+)`/g;

  const valuesMatch = valuesRegex.exec(sql);
  const fieldsMatch = sql.match(fieldsRegex);

  if (
    !valuesMatch ||
    valuesMatch.length <= 1 ||
    !fieldsMatch ||
    fieldsMatch.length <= 1 ||
    !value
  ) {
    return null;
  }

  const valuesString = valuesMatch[1];
  const valuesArray = valuesString
    .split(',')
    .map((value) => value.trim().replaceAll("'", ''));
  const fieldsArray = fieldsMatch.slice(1).map((field) => field.slice(1, -1));

  const index = valuesArray.indexOf(value);

  if (index === -1) {
    return null;
  }

  return fieldsArray[index];
};
