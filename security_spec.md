# Firestore Security Specification

## Data Invariants
1. Certificates must have a non-empty name, owner, and ownerId.
2. Employees must have a non-empty name and ownerId.
3. Users can only read, write, and delete documents they "own" (where `ownerId` matches their UID).
4. Timestamps must be validated (though for now we are using ISO strings in the app, I should ideally use server timestamps, but I will stick to what the app does while enforcing basic safety).

## The "Dirty Dozen" Payloads

### Certificates
1. **Identity Theft**: User A tries to create a certificate with `ownerId` of User B. (DENIED)
2. **Ghost Field**: User A adds `isVerified: true` to a certificate. (DENIED)
3. **ID Poisoning**: User A tries to create a certificate with a 2KB junk string as the document ID. (DENIED)
4. **Type Mismatch**: User A sends `skp: "ten"` (string instead of number). (DENIED)
5. **Orphaned Write**: User A tries to update a certificate they don't own. (DENIED)
6. **Immutable Field**: User A tries to change the `ownerId` of an existing certificate. (DENIED)

### Employees
7. **Identity Theft**: User A tries to create an employee with `ownerId` of User B. (DENIED)
8. **Resource Exhaustion**: User A sends a 1MB string for the `dept` field. (DENIED)
9. **State Shortcut**: User A tries to delete an employee they don't own. (DENIED)
10. **Schema Bypass**: User A tries to create an employee without a `name`. (DENIED)
11. **Spoofing**: User A tries to list all employees without being signed in. (DENIED)
12. **PII Leak**: User A tries to get User B's employee profile by guessing the ID. (DENIED)
