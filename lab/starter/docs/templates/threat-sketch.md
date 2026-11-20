# Threat sketch

Complete this in about ten minutes, before writing code. Keep it rough.

## 1. The change in one sentence

> Who does what to which data?

## 2. Data flow

| Step | From | To | Data | Crosses a trust boundary? |
|---|---|---|---|---|
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

Trust boundaries in this service: browser to API, API to data store, API to third-party services,
and **tenant to tenant**.

## 3. Open decisions

| Question | Who decides | Decision |
|---|---|---|
| Who may perform this action? |  |  |
| Which records are in scope? |  |  |
| Which fields may leave the system? |  |  |
| What input and limits apply? |  |  |
| What is logged? What is never logged? |  |  |

## 4. What could go wrong?

| Threat | Impact | Control we will rely on |
|---|---|---|
|  |  |  |

## 5. Security acceptance criteria (two or three)

| ID | Criterion | ASVS ref | How we will verify it |
|---|---|---|---|
| SAC-1 |  |  |  |
| SAC-2 |  |  |  |
| SAC-3 |  |  |  |
