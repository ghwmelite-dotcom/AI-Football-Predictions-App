# Add Database Table

You are helping to add a new table to the Convex database schema.

## Table Definition Template

```typescript
// In convex/schema.ts

tableName: defineTable({
  // Required fields
  userId: v.id("users"), // Foreign key
  createdAt: v.number(), // Timestamp (Date.now())

  // Data fields with appropriate validators
  stringField: v.string(),
  numberField: v.number(),
  booleanField: v.boolean(),
  optionalField: v.optional(v.string()),
  arrayField: v.array(v.string()),
  objectField: v.object({
    nestedField: v.string(),
  }),
  unionField: v.union(
    v.literal("option1"),
    v.literal("option2"),
    v.literal("option3")
  ),

  // Timestamps
  updatedAt: v.optional(v.number()),
})
  // Indexes for query optimization
  .index("by_user", ["userId"])
  .index("by_date", ["createdAt"])
  .index("by_user_and_date", ["userId", "createdAt"])
```

## Convex Validator Types

### Basic Types
- `v.string()` - String
- `v.number()` - Number (integers and floats)
- `v.boolean()` - Boolean
- `v.null()` - Null value
- `v.bigint()` - BigInt

### Complex Types
- `v.id("tableName")` - Reference to another table
- `v.optional(v.string())` - Optional field
- `v.array(v.string())` - Array of strings
- `v.object({ field: v.string() })` - Nested object
- `v.union(v.literal("a"), v.literal("b"))` - One of multiple values
- `v.any()` - Any type (avoid if possible)

### Literal Values
```typescript
status: v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("completed"),
  v.literal("cancelled")
)
```

## Index Best Practices

### When to Add Indexes
- Always index foreign keys (`userId`, `matchId`, etc.)
- Index fields used in `.withIndex()` queries
- Index fields used for sorting
- Index timestamp fields if filtering by date

### Index Patterns
```typescript
// Single field index
.index("by_user", ["userId"])

// Composite index (order matters!)
.index("by_user_and_status", ["userId", "status"])

// For date range queries
.index("by_date", ["createdAt"])
```

### Query Performance
```typescript
// Good - uses index
await ctx.db
  .query("tableName")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect();

// Bad - full table scan
await ctx.db
  .query("tableName")
  .filter((q) => q.eq(q.field("userId"), userId))
  .collect();
```

## Common Table Patterns

### User-Related Table
```typescript
userActivity: defineTable({
  userId: v.id("users"),
  activityType: v.string(),
  metadata: v.object({
    description: v.string(),
    value: v.optional(v.number()),
  }),
  createdAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_and_date", ["userId", "createdAt"])
  .index("by_type", ["activityType"])
```

### Match-Related Table
```typescript
matchStatistics: defineTable({
  matchId: v.id("matches"),
  teamId: v.string(),
  possession: v.number(),
  shots: v.number(),
  shotsOnTarget: v.number(),
  corners: v.number(),
  fouls: v.number(),
  yellowCards: v.number(),
  redCards: v.number(),
  updatedAt: v.number(),
})
  .index("by_match", ["matchId"])
  .index("by_team", ["teamId"])
```

### Relationship Table (Many-to-Many)
```typescript
userFollowing: defineTable({
  followerId: v.id("users"),
  followeeId: v.id("users"),
  createdAt: v.number(),
})
  .index("by_follower", ["followerId"])
  .index("by_followee", ["followeeId"])
```

## Schema Migration Notes

### Important
- Schema changes deploy automatically with `npx convex dev`
- Adding fields: Safe (existing documents get undefined for new optional fields)
- Removing fields: Safe (data persists, just not queried)
- Changing field types: Requires data migration
- Adding indexes: Safe and automatic

### After Adding Table
1. Deploy schema: Already happening with `npx convex dev`
2. Create backend functions to interact with the table
3. Create frontend components to display/modify data
4. Test thoroughly

## Your Task
1. Ask the user what table they want to add
2. Understand the data structure needed
3. Define the table with appropriate validators
4. Add necessary indexes
5. Create backend functions to interact with the table

Now ask the user about the table they want to create.
