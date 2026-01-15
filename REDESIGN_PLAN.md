# Database Redesign Plan

## Current State
- Table `users` has many columns (nombre, apellido, email, rol, documento, etc.)
- Uses role-based system in users table

## Target State
- Table `users` simplified to: id, username, password
- New tables: categories, coaches, players
- Join table: coach_categories (for N:M relationship)

## Migration Strategy
1. Create new tables: categories, coaches, players, coach_categories
2. Migrate data from old users structure to new structure (if needed)
3. Drop old columns from users table
4. Rename/restructure users table to match new schema

## Order of Operations
1. Create categories table
2. Create coaches table (with FK to users)
3. Create players table (with FK to users, categories, coaches)
4. Create coach_categories join table
5. Modify users table (drop old columns, rename to username)
6. Update all foreign keys
