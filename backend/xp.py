from math import floor


LEVEL_REQUIREMENTS = {
    1: 3600,
    2: 5000,
    3: 10000,
    4: 15000,
    5: 20000,
    6: 25000,
    7: 30000,
    8: 35000,
    9: 40000,
    10: 50000,
    11: 60000,
    12: 70000,
    13: 80000,
    14: 90000,
    15: 100000,
}


def xp_for_level(level: int) -> int:
    if level in LEVEL_REQUIREMENTS:
        return LEVEL_REQUIREMENTS[level]

    decade = floor((level - 15) / 10)
    levels_in_decade = (level - 15) % 10

    decade_start_xp = 100000 * (
        decade * (decade + 1) / 2 + 1
    )
    xp_per_level = 10000 + 10000 * decade

    return int(decade_start_xp + levels_in_decade * xp_per_level)


def cumulative_xp_for_level(level: int) -> int:
    return sum(xp_for_level(i) for i in range(1, level + 1))


def calculate_level(total_xp: float) -> int:
    level = 0

    while total_xp >= cumulative_xp_for_level(level + 1):
        level += 1

    return level


def calculate_activity_xp(
    duration: int,
    category_multiplier: float,
    current_level: int,
) -> float:
    level_multiplier = 1 + current_level * 0.01

    return duration * level_multiplier * category_multiplier
