# Database Design - Logical Diagram

## Tables Structure

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username (UK)   │
│ password        │
└─────────────────┘
        │
        │ 1:1
        │
    ┌───┴───┐
    │       │
┌───▼───┐ ┌─▼───────┐
│players│ │ coaches │
└───────┘ └─────────┘
```

## Detailed Schema

### Table: users
- **id**: integer (PK, auto-increment)
- **username**: varchar (unique, not null)
- **password**: varchar (not null)

### Table: categories
- **id**: integer (PK, auto-increment)
- **name**: varchar (not null)
- **created_at**: timestamp (default: CURRENT_TIMESTAMP)
- **updated_at**: timestamp (default: CURRENT_TIMESTAMP)

### Table: players
- **id**: integer (PK, auto-increment)
- **user_id**: integer (FK → users.id, unique, not null)
- **category_id**: integer (FK → categories.id, not null)
- **coach_id**: integer (FK → coaches.id, not null)
- **first_name**: varchar (not null)
- **last_name**: varchar (not null)
- **email**: varchar (not null)
- **document**: varchar (not null)
- **document_type**: varchar (not null)
- **birth_date**: date
- **family_contact**: varchar
- **relationship**: varchar
- **is_active**: boolean (default: false)
- **created_at**: timestamp (default: CURRENT_TIMESTAMP)
- **updated_at**: timestamp (default: CURRENT_TIMESTAMP)

### Table: coaches
- **id**: integer (PK, auto-increment)
- **user_id**: integer (FK → users.id, unique, not null)
- **first_name**: varchar (not null)
- **last_name**: varchar (not null)
- **document_type**: varchar (not null)
- **document**: varchar (not null)
- **created_at**: timestamp (default: CURRENT_TIMESTAMP)
- **updated_at**: timestamp (default: CURRENT_TIMESTAMP)

### Table: coach_categories (Join Table)
- **coach_id**: integer (FK → coaches.id, PK)
- **category_id**: integer (FK → categories.id, PK)
- **created_at**: timestamp (default: CURRENT_TIMESTAMP)

## Relationships

1. **users ↔ players** (1:1)
   - One user can have one player profile
   - One player belongs to one user

2. **users ↔ coaches** (1:1)
   - One user can have one coach profile
   - One coach belongs to one user

3. **players → categories** (N:1)
   - Many players can belong to one category
   - One category can have many players

4. **players → coaches** (N:1)
   - Many players can belong to one coach
   - One coach can have many players

5. **coaches ↔ categories** (N:M)
   - Many coaches can be associated with many categories
   - Implemented via `coach_categories` join table
