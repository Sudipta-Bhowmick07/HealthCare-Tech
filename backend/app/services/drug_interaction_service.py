DRUG_INTERACTIONS = {
    ("ibuprofen", "paracetamol"):
        "May cause stomach irritation if overused.",

    ("cetirizine", "alprazolam"):
        "Can increase dizziness and sleepiness.",

    ("aspirin", "ibuprofen"):
        "May increase bleeding risk."
}


def check_interactions(medicines):

    warnings = []

    normalized = [m.lower() for m in medicines]

    for med1 in normalized:
        for med2 in normalized:

            if med1 == med2:
                continue

            pair = (med1, med2)
            reverse_pair = (med2, med1)

            if pair in DRUG_INTERACTIONS:

                warnings.append(
                    f"{med1.title()} + {med2.title()}: "
                    f"{DRUG_INTERACTIONS[pair]}"
                )

            elif reverse_pair in DRUG_INTERACTIONS:

                warnings.append(
                    f"{med1.title()} + {med2.title()}: "
                    f"{DRUG_INTERACTIONS[reverse_pair]}"
                )

    warnings = list(set(warnings))

    return warnings