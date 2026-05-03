Implement exactly this new schemas:

2. Relationship.js
Then create basic CRUD APIs
After implementation, confirm these routes are working:

GET /healthz
GET /api/relationships

Test URLs
GET  http://localhost:9800/api/relationships
POST http://localhost:9800/api/relationships
GET  http://localhost:9800/api/relationships/person/PERSON_ID_HERE/all
GET  http://localhost:9800/api/relationships/family-group/FG-0001/all

Sample POST Body
{
  "familyGroupCode": "FG-0001",
  "fromPersonId": "PARENT_PERSON_OBJECT_ID",
  "toPersonId": "CHILD_PERSON_OBJECT_ID",
  "relationshipType": "PARENT_OF",
  "relationshipDirection": "DIRECTED",
  "isBiological": true,
  "sourceType": "USER_ENTERED",
  "notes": "Initial parent-child relationship"
}