import base64
import re

def decode_and_transform(values, dynamic_value):
    result = ""
    for value in values:
        decoded_value = base64.b64decode(value).decode("utf-8")
        numeric_value = int("".join(filter(str.isdigit, decoded_value))) - dynamic_value
        char_value = chr(numeric_value)
        result += char_value
    return result

def extract_values_from_javascript(js_code):
    pattern = r"var (\w+) = (\[[^\]]+\]);"
    matches = re.findall(pattern, js_code)
    return eval(matches[0][1])

def extract_dynamic_value(js_code):
    pattern = r"\)\s*-\s*(\d+)"
    match = re.search(pattern, js_code)
    return int(match.group(1)) if match else 0

def execute_javascript_code(js_code):
    variable_values = extract_values_from_javascript(js_code)
    dynamic_value = extract_dynamic_value(js_code)
    return decode_and_transform(variable_values, dynamic_value)
