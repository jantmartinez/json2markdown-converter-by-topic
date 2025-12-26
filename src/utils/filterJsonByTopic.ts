type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

const filterJsonByTopic = (data: JsonValue, topic: string): JsonValue | null => {
  if (!topic.trim()) {
    return data;
  }

  const normalizedTopic = topic.toLowerCase().trim();

  const matches = (key: string): boolean => {
    const normalizedKey = key.toLowerCase();
    return normalizedKey.includes(normalizedTopic) || normalizedTopic.includes(normalizedKey);
  };

  const searchInValue = (value: JsonValue): JsonValue | null => {
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      if (typeof value === 'string' && value.toLowerCase().includes(normalizedTopic)) {
        return value;
      }
      return null;
    }

    if (Array.isArray(value)) {
      const filteredArray = value
        .map(item => searchInValue(item))
        .filter(item => item !== null);

      return filteredArray.length > 0 ? filteredArray : null;
    }

    if (typeof value === 'object') {
      return filterObject(value as JsonObject);
    }

    return null;
  };

  const filterObject = (obj: JsonObject): JsonObject | null => {
    const result: JsonObject = {};
    let hasMatches = false;

    for (const [key, value] of Object.entries(obj)) {
      if (matches(key)) {
        result[key] = value;
        hasMatches = true;
      } else {
        const filteredValue = searchInValue(value);
        if (filteredValue !== null) {
          result[key] = filteredValue;
          hasMatches = true;
        }
      }
    }

    return hasMatches ? result : null;
  };

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    return filterObject(data as JsonObject);
  }

  return searchInValue(data);
};

export default filterJsonByTopic;
