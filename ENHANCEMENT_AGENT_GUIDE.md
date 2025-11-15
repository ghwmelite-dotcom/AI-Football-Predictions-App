# Enhancement Agent System Guide

Welcome to the AI Football Predictions Platform Enhancement Agent System! This guide will help you efficiently add new features, optimize code, and maintain high quality standards.

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Available Commands](#available-commands)
4. [Enhancement Workflows](#enhancement-workflows)
5. [Code Patterns Reference](#code-patterns-reference)
6. [Best Practices](#best-practices)
7. [Quality Checklists](#quality-checklists)

---

## Overview

The Enhancement Agent System provides:
- **Intelligent Slash Commands** - Pre-configured workflows for common tasks
- **Code Templates** - Consistent patterns for backend and frontend code
- **Quality Checklists** - Ensure every enhancement meets standards
- **Configuration Reference** - Quick access to project patterns and conventions

### System Components

```
.claude/
├── enhancement-agent-config.json  # Project patterns and conventions
└── commands/                      # Slash commands
    ├── new-feature.md            # Add complete new feature
    ├── add-backend-function.md   # Add Convex backend function
    ├── add-component.md          # Add React component
    ├── add-table.md              # Add database table
    ├── review-code.md            # Code quality review
    └── optimize-feature.md       # Performance optimization
```

---

## Quick Start

### Using Slash Commands

In Claude Code chat, simply type `/` followed by the command name:

```
/new-feature          # Guided workflow to add complete feature
/add-backend-function # Add new backend query/mutation/action
/add-component        # Add new React component
/add-table            # Add new database table
/review-code          # Review code quality
/optimize-feature     # Optimize performance
```

### Example: Adding a New Feature

1. Type `/new-feature` in chat
2. Describe what you want to build (e.g., "Add a notifications system")
3. Follow the guided workflow:
   - Database schema updates
   - Backend implementation
   - Frontend components
   - Integration and testing
   - Documentation

The agent will guide you through each step with templates and best practices!

---

## Available Commands

### `/new-feature` - Complete Feature Implementation

**Use When:** Adding a new major feature (e.g., notifications, betting streaks, match predictions export)

**What It Does:**
- Guides through full feature development lifecycle
- Updates database schema
- Creates backend functions
- Builds frontend components
- Ensures integration and testing
- Updates documentation

**Example Use Cases:**
- Add email notification system
- Create betting streak tracking
- Implement match prediction export (PDF/CSV)
- Add user referral program
- Create custom dashboard widgets

---

### `/add-backend-function` - Backend Function Creation

**Use When:** Adding individual Convex queries, mutations, or actions

**What It Does:**
- Provides templates for query/mutation/action patterns
- Includes auth guards and error handling
- Ensures proper TypeScript typing
- Adds input validation

**Example Use Cases:**
- Add query to fetch user's favorite teams
- Create mutation to update user preferences
- Add action to call external betting API
- Implement admin function to manage users

**Function Types:**
- **Query** - Read data (cached, reactive, fast)
- **Mutation** - Write data (transactional, immediate)
- **Action** - External calls (APIs, AI, non-transactional)

---

### `/add-component` - React Component Creation

**Use When:** Creating new UI components

**What It Does:**
- Provides React component template
- Includes Convex hooks setup
- Adds Tailwind styling patterns
- Implements Framer Motion animations
- Handles loading/error states

**Example Use Cases:**
- Create new card for displaying data
- Build form for user input
- Add chart component for analytics
- Create modal dialog
- Build custom button variants

**Design System:**
- Consistent styling (Tailwind classes)
- Smooth animations (Framer Motion)
- Responsive design (mobile-first)
- Accessible components

---

### `/add-table` - Database Table Creation

**Use When:** Adding new tables to Convex schema

**What It Does:**
- Provides table definition template
- Lists all Convex validator types
- Explains indexing best practices
- Guides through schema migration

**Example Use Cases:**
- Add table for storing user notifications
- Create table for betting streaks
- Add table for user referrals
- Create table for custom widgets

**Key Concepts:**
- Validators ensure type safety
- Indexes optimize query performance
- Relationships via `v.id("tableName")`

---

### `/review-code` - Code Quality Review

**Use When:** Reviewing code before committing or when optimizing

**What It Does:**
- Comprehensive quality checklist
- Security vulnerability checks
- Performance review
- Accessibility audit
- Best practices validation

**Review Areas:**
- Type safety
- Security (auth, validation, injection prevention)
- Database query optimization
- Error handling
- Code organization
- UX (loading states, animations, responsive)
- Accessibility

---

### `/optimize-feature` - Performance Optimization

**Use When:** Feature is slow or needs improvement

**What It Does:**
- Identifies performance bottlenecks
- Provides optimization strategies
- Implements caching, pagination, debouncing
- Reduces bundle size
- Improves UX with optimistic updates

**Optimization Types:**
- Database query optimization
- Frontend rendering optimization
- Bundle size reduction
- UX improvements (loading states, animations)
- Security hardening

---

## Enhancement Workflows

### Workflow 1: Adding a New View to Dashboard

**Steps:**
1. `/add-table` - Create database tables for the feature
2. `/add-backend-function` - Create queries/mutations (repeat as needed)
3. `/add-component` - Create main component
4. Update `Dashboard.tsx`:
   ```typescript
   const views = {
     // ... existing
     newView: 'New View Name',
   };

   // In render
   {currentView === 'newView' && (
     <div className="space-y-6">
       <NewComponent />
     </div>
   )}
   ```
5. `/review-code` - Review implementation
6. Test thoroughly

**Example:** Adding a "Streak Tracker" view
- Table: `bettingStreaks` (userId, currentStreak, longestStreak, etc.)
- Functions: `getUserStreak`, `updateStreak`, `getTopStreaks`
- Component: `StreakTrackerCard.tsx`
- Dashboard integration

---

### Workflow 2: Adding Analytics Feature

**Steps:**
1. `/add-table` - Create analytics table
2. `/add-backend-function` - Data collection function
3. `/add-backend-function` - Analytics query function
4. `/add-component` - Chart/visualization component
5. Integrate with existing analytics view
6. `/review-code` - Review

**Example:** Win rate by day of week
- Table: `dayOfWeekStats` (userId, dayName, wins, losses, etc.)
- Functions: `trackDailyResult`, `getDayOfWeekStats`
- Component: Add to `AnalyticsAIHub.tsx`

---

### Workflow 3: Optimizing Slow Feature

**Steps:**
1. Identify slow component/query
2. `/optimize-feature` - Get optimization strategies
3. Implement optimizations:
   - Add database indexes
   - Add pagination
   - Implement caching
   - Add loading states
4. Measure improvement
5. `/review-code` - Ensure quality maintained

**Example:** Slow community feed
- Add pagination (20 items per page)
- Index `createdAt` for sorting
- Add skeleton loaders
- Implement infinite scroll

---

## Code Patterns Reference

### Backend Patterns

#### Query with Auth Guard
```typescript
export const getData = query({
  args: { id: v.id("tableName") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    return await ctx.db.get(args.id);
  },
});
```

#### Mutation with Validation
```typescript
export const updateData = mutation({
  args: {
    id: v.id("tableName"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");

    // Validate
    if (args.value.length === 0) {
      throw new Error("Value cannot be empty");
    }

    await ctx.db.patch(args.id, {
      value: args.value,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
```

#### Action with External API
```typescript
export const fetchExternalData = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(
        `https://api.example.com?q=${args.query}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        }
      );

      const data = await response.json();

      // Store using mutation
      await ctx.runMutation(api.module.storeData, {
        data: data,
      });

      return data;
    } catch (error) {
      console.error("API error:", error);
      throw new Error("Failed to fetch data");
    }
  },
});
```

### Frontend Patterns

#### Component with Loading State
```typescript
export function DataCard() {
  const data = useQuery(api.module.getData, {});

  if (data === undefined) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Data</h2>
      {/* Content */}
    </motion.div>
  );
}
```

#### Form with Mutation
```typescript
export function CreateForm() {
  const [value, setValue] = useState("");
  const createItem = useMutation(api.module.createItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createItem({ value });
      setValue("");
      toast.success("Item created!");
    } catch (error) {
      toast.error("Failed to create item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Enter value"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg"
      >
        Create
      </button>
    </form>
  );
}
```

---

## Best Practices

### Database Best Practices
1. **Always add indexes** for foreign keys and query fields
2. **Use composite indexes** for common multi-field queries
3. **Paginate large datasets** (use `paginate()`)
4. **Validate input** with Convex validators
5. **Use `.withIndex()`** instead of `.filter()` for better performance

### Backend Best Practices
1. **Add auth guards** to all mutations and sensitive queries
2. **Handle errors gracefully** with try-catch and user-friendly messages
3. **Use TypeScript types** throughout
4. **Extract common logic** into helper functions
5. **Log errors** for debugging but don't expose internals to users

### Frontend Best Practices
1. **Handle loading states** (skeleton loaders)
2. **Handle error states** (error messages, retry buttons)
3. **Handle empty states** (helpful messages, CTAs)
4. **Use responsive design** (mobile-first with Tailwind breakpoints)
5. **Add animations** (Framer Motion for smooth UX)
6. **Optimize re-renders** (memoization, proper dependencies)

### Security Best Practices
1. **Never trust user input** - validate everything
2. **Use environment variables** for secrets
3. **Implement rate limiting** for expensive operations
4. **Sanitize user-generated content** before storage
5. **Use HTTPS** for all external API calls

---

## Quality Checklists

### Backend Function Checklist
- [ ] TypeScript types defined
- [ ] Convex validators for all args
- [ ] Auth guard added (if needed)
- [ ] Input validation implemented
- [ ] Error handling with try-catch
- [ ] User-friendly error messages
- [ ] Database indexes exist for queries
- [ ] Function tested manually
- [ ] Code follows existing patterns

### Frontend Component Checklist
- [ ] TypeScript props defined
- [ ] Convex hooks implemented correctly
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Empty state handled
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Tailwind CSS styling
- [ ] Framer Motion animations
- [ ] Accessibility considered
- [ ] Component tested on all screen sizes

### Database Table Checklist
- [ ] Appropriate validators used
- [ ] Foreign keys defined with `v.id()`
- [ ] Indexes added for query fields
- [ ] Composite indexes for multi-field queries
- [ ] Timestamps included (createdAt, updatedAt)
- [ ] Schema deployed successfully
- [ ] Backend functions created for table
- [ ] Frontend components integrated

---

## Common Patterns

### Leaderboard Pattern
```typescript
// Backend
export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
    timeframe: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("allTime")
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    // Filter by timeframe, sort by score, limit results
    const users = await ctx.db
      .query("userStats")
      .withIndex("by_score")
      .order("desc")
      .take(limit);

    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  },
});
```

### Statistics Aggregation Pattern
```typescript
// Backend
export const getUserStatistics = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bets = await ctx.db
      .query("betTracker")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const won = bets.filter(b => b.status === "won").length;
    const lost = bets.filter(b => b.status === "lost").length;
    const total = won + lost;

    const totalStaked = bets.reduce((sum, b) => sum + b.stake, 0);
    const totalProfit = bets.reduce((sum, b) =>
      sum + (b.status === "won" ? b.stake * (b.odds - 1) :
             b.status === "lost" ? -b.stake : 0), 0
    );

    return {
      winRate: total === 0 ? 0 : (won / total) * 100,
      totalBets: total,
      totalStaked,
      totalProfit,
      roi: totalStaked === 0 ? 0 : (totalProfit / totalStaked) * 100,
    };
  },
});
```

### Real-time Updates Pattern
```typescript
// Frontend - automatic updates with Convex
export function LiveScore({ matchId }: { matchId: Id<"matches"> }) {
  // Automatically updates when match data changes
  const match = useQuery(api.matches.getMatchById, { id: matchId });

  if (!match) return null;

  return (
    <div className="text-2xl font-bold">
      {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
    </div>
  );
}
```

---

## Tips and Tricks

### Tip 1: Use Multiple Commands in Sequence
For complex features, chain commands:
```
/add-table           # Create database structure
/add-backend-function # Create query
/add-backend-function # Create mutation
/add-component       # Create UI
/review-code         # Review everything
```

### Tip 2: Reference Existing Code
Before creating new patterns, check existing code:
- Similar features in `convex/` directory
- Component patterns in `src/components/`
- Schema patterns in `convex/schema.ts`

### Tip 3: Test as You Build
Don't wait until the end to test:
1. Test backend functions in Convex dashboard
2. Test components in isolation
3. Test integration incrementally
4. Test on multiple screen sizes

### Tip 4: Keep It Simple
Start with MVP:
1. Basic functionality first
2. Add optimizations later
3. Enhance UX incrementally
4. Iterate based on feedback

### Tip 5: Document as You Go
Add inline comments for:
- Complex algorithms
- Non-obvious business logic
- Magic numbers (explain what they represent)
- Important assumptions

---

## Getting Help

### In-Code Documentation
- **Config Reference**: `.claude/enhancement-agent-config.json`
- **Command Guides**: `.claude/commands/*.md`
- **Project Docs**: `README.md`, `TIER1_IMPLEMENTATION_SUMMARY.md`, etc.

### Using Slash Commands
Type `/` in Claude Code chat to see all available commands. Each command provides:
- Step-by-step guidance
- Code templates
- Best practices
- Examples

### Project Context
See these files for project understanding:
- `TIER1_IMPLEMENTATION_SUMMARY.md` - TIER 1 features overview
- `TIER2_IMPLEMENTATION_SUMMARY.md` - TIER 2 features overview
- `LIVE_FEATURES_GUIDE.md` - Live features guide
- `QUICK_START_TIER1.md` - Quick start guide

---

## Examples

### Example 1: Add User Favorites Feature

**Goal:** Let users mark teams/leagues as favorites

**Steps:**
1. `/add-table` - Create `userFavorites` table
   ```typescript
   userFavorites: defineTable({
     userId: v.id("users"),
     type: v.union(v.literal("team"), v.literal("league")),
     itemId: v.string(),
     createdAt: v.number(),
   })
     .index("by_user", ["userId"])
     .index("by_user_and_type", ["userId", "type"])
   ```

2. `/add-backend-function` - Create mutation to add favorite
   ```typescript
   export const addFavorite = mutation({
     args: {
       type: v.union(v.literal("team"), v.literal("league")),
       itemId: v.string(),
     },
     handler: async (ctx, args) => {
       const userId = await getAuthUserId(ctx);
       if (!userId) throw new Error("Must be logged in");

       // Check if already exists
       const existing = await ctx.db
         .query("userFavorites")
         .withIndex("by_user", (q) => q.eq("userId", userId))
         .filter((q) =>
           q.and(
             q.eq(q.field("type"), args.type),
             q.eq(q.field("itemId"), args.itemId)
           )
         )
         .first();

       if (existing) {
         throw new Error("Already in favorites");
       }

       await ctx.db.insert("userFavorites", {
         userId,
         type: args.type,
         itemId: args.itemId,
         createdAt: Date.now(),
       });

       return { success: true };
     },
   });
   ```

3. `/add-backend-function` - Create query to get favorites
   ```typescript
   export const getUserFavorites = query({
     args: {
       type: v.optional(v.union(v.literal("team"), v.literal("league"))),
     },
     handler: async (ctx, args) => {
       const userId = await getAuthUserId(ctx);
       if (!userId) return [];

       let query = ctx.db
         .query("userFavorites")
         .withIndex("by_user", (q) => q.eq("userId", userId));

       if (args.type) {
         query = query.filter((q) => q.eq(q.field("type"), args.type));
       }

       return await query.collect();
     },
   });
   ```

4. `/add-component` - Create favorites UI
   ```typescript
   export function FavoritesCard() {
     const favorites = useQuery(api.favorites.getUserFavorites, {});
     const addFavorite = useMutation(api.favorites.addFavorite);
     const removeFavorite = useMutation(api.favorites.removeFavorite);

     // Component implementation...
   }
   ```

5. Integration and testing

---

### Example 2: Optimize Slow Leaderboard

**Problem:** Global leaderboard takes 3+ seconds to load

**Steps:**
1. `/optimize-feature` - Analyze bottleneck

2. Identify issue: Loading all users instead of top 100

3. Implement pagination:
   ```typescript
   export const getGlobalLeaderboard = query({
     args: {
       paginationOpts: paginationOptsValidator,
     },
     handler: async (ctx, args) => {
       return await ctx.db
         .query("userStats")
         .withIndex("by_xp")
         .order("desc")
         .paginate(args.paginationOpts);
     },
   });
   ```

4. Update frontend:
   ```typescript
   const { results, loadMore } = usePaginatedQuery(
     api.gamification.getGlobalLeaderboard,
     {},
     { initialNumItems: 50 }
   );
   ```

5. Add caching for top 10 (refresh every 5 minutes)

6. Measure improvement: Load time reduced to <500ms

---

## Conclusion

The Enhancement Agent System accelerates development while maintaining code quality. Use the slash commands to guide your development process, follow the patterns and best practices, and leverage the quality checklists to ensure every enhancement is production-ready.

**Quick Command Reference:**
- `/new-feature` - Complete feature workflow
- `/add-backend-function` - Backend queries/mutations/actions
- `/add-component` - React components
- `/add-table` - Database tables
- `/review-code` - Code quality review
- `/optimize-feature` - Performance optimization

Happy coding!
