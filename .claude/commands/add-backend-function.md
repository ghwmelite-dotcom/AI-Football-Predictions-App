# Add Backend Function

You are helping to add a new backend function to the Convex backend.

## Quick Reference

### Function Types
1. **Query** - Read data (cached, reactive)
2. **Mutation** - Write data (transactional)
3. **Action** - External API calls, AI calls (non-transactional)

### Template Patterns

#### Query Pattern
```typescript
export const getFunctionName = query({
  args: {
    userId: v.id("users"),
    // ... more args with validators
  },
  handler: async (ctx, args) => {
    // Auth guard if needed
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Query database
    const data = await ctx.db
      .query("tableName")
      .withIndex("indexName", (q) => q.eq("field", args.value))
      .collect();

    return data;
  },
});
```

#### Mutation Pattern
```typescript
export const updateFunctionName = mutation({
  args: {
    id: v.id("tableName"),
    field: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth guard
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Validate and update
    await ctx.db.patch(args.id, {
      field: args.field,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

#### Action Pattern
```typescript
export const aiActionName = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // External API call (e.g., OpenAI)
      const response = await fetch("https://api.example.com", {
        method: "POST",
        body: JSON.stringify({ prompt: args.prompt }),
      });

      const data = await response.json();

      // Store results using runMutation
      await ctx.runMutation(api.moduleName.storeFunctionName, {
        data: data,
      });

      return data;
    } catch (error) {
      console.error("Action error:", error);
      throw new Error("Failed to complete action");
    }
  },
});
```

### Admin Guard Pattern
```typescript
const roleDoc = await ctx.db
  .query("userRoles")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .first();

if (roleDoc?.role !== "admin") {
  throw new Error("Admin access required");
}
```

## Your Task
1. Ask the user what function they want to add
2. Determine if it should be a query, mutation, or action
3. Implement following the patterns above
4. Add appropriate error handling
5. Test with frontend integration

Now ask the user about the function they want to create.
