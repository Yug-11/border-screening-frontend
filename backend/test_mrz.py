from app.services.ocr.mrz_detector import calculate_check_digit


document_number = "PDEMO0001"
date_of_birth = "980614"
expiry_date = "360101"

document_check = calculate_check_digit(document_number)
dob_check = calculate_check_digit(date_of_birth)
expiry_check = calculate_check_digit(expiry_date)

optional_data = "0" * 14
optional_check = calculate_check_digit(optional_data)

line2_without_composite = (
    document_number
    + document_check
    + "IND"
    + date_of_birth
    + dob_check
    + "M"
    + expiry_date
    + expiry_check
    + optional_data
    + optional_check
)

composite_check = calculate_check_digit(line2_without_composite)

line1 = "P<INDIA<<SHARMA<<AARAV<<<<<<<<<<<<<<<<<<<<"
line2 = line2_without_composite + composite_check

print("LINE 1:", line1)
print("LENGTH:", len(line1))

print("LINE 2:", line2)
print("LENGTH:", len(line2))