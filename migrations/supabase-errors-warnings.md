

## Supabase App terminal output errors

> v44-trainnect-ai-search-no-auth@0.4.4 dev /Users/imacbaby/Pictures/v44-trainnect-ai-search
> next dev

   ▲ Next.js 15.2.2
   - Local:        http://localhost:3000
   - Network:      http://192.168.100.76:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 3.3s
 ○ Compiling /middleware ...
 ✓ Compiled /middleware in 1019ms (217 modules)
 ○ Compiling /auth/login ...
 ✓ Compiled /auth/login in 9.6s (2045 modules)
 GET /auth/login 200 in 10910ms
 ✓ Compiled in 1439ms (863 modules)
 GET /auth/login? 200 in 314ms
 GET /auth/login 200 in 206ms
 ○ Compiling / ...
 ✓ Compiled / in 6.2s (2663 modules)
 GET / 200 in 7455ms
 ○ Compiling /api/storage/init ...
 ✓ Compiled /api/storage/init in 1926ms (2670 modules)
Bucket does not exist. It should be created through SQL migrations.
 POST /api/storage/init 200 in 2691ms
 ○ Compiling /api/chat ...
 ✓ Compiled /api/chat in 1523ms (2730 modules)
Attempting to use model: claude-3.7-sonnet with options: {
  anthropic: {
    thinking: { type: 'disabled', budgetTokens: 12000 },
    model: 'claude-3-7-sonnet-20250219'
  }
}
 POST /api/chat 200 in 11660ms
 ○ Compiling /chat/[id] ...
 ✓ Compiled /chat/[id] in 1905ms (2732 modules)
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 4436ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 234ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 341ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 496ms
 GET / 200 in 46ms
 ○ Compiling /tavily-ai-search ...
 ✓ Compiled /tavily-ai-search in 1385ms (2738 modules)
 GET /tavily-ai-search 200 in 1775ms
 ○ Compiling /ai-agents ...
 ✓ Compiled /ai-agents in 1076ms (2748 modules)
 GET /ai-agents 200 in 1244ms
 GET / 200 in 41ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/26f58610-d8c2-4043-a268-b671d1793f1f 200 in 444ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/8943f1d5-e125-4b81-b915-7855a1f46308 200 in 203ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/b9b3ea3f-3e22-4227-930d-8b4418a6cf89 200 in 191ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/0e9d01c9-ef59-4391-9eef-8439208db16e 200 in 213ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 227ms
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:25:21)
  23 |     .from('chat_sessions')
  24 |     .select('*')
> 25 |     .eq('id', params.id)
     |                     ^
  26 |     .single();
  27 |   
  28 |   if (chatSessionError || !chatSession) {
Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.
Error: Route "/chat/[id]" used `params.id`. `params` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at ChatPage (app/chat/[id]/page.tsx:49:32)
  47 |     <div className="flex flex-col h-[calc(100vh-4rem)]">
  48 |       <div className="w-full">
> 49 |         <Chat sessionId={params.id} />
     |                                ^
  50 |       </div>
  51 |     </div>
  52 |   );
 GET /chat/907ad907-a523-48e8-808e-763b230f0576 200 in 933ms

 ## Supabase Dashboard warnings

                                                                               |

| function_search_path_mutable    | Function Search Path Mutable        | WARN  | EXTERNAL | ["SECURITY"] | Detects functions where the search_path parameter is not set.               | Function \`public.update_updated_at_column\` has a role mutable search_path                                                              | https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable         | {"name":"update_updated_at_column","type":"function","schema":"public"} | function_search_path_mutable_public_update_updated_at_column_da5ac28a58c8b4bb30209bf0d3d7082c |
| function_search_path_mutable    | Function Search Path Mutable        | WARN  | EXTERNAL | ["SECURITY"] | Detects functions where the search_path parameter is not set.               | Function \`public.archive_chat\` has a role mutable search_path                                                                          | https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable         | {"name":"archive_chat","type":"function","schema":"public"}             | function_search_path_mutable_public_archive_chat_011c98a8926fe8faabd85b3a49000ba8             |
| function_search_path_mutable    | Function Search Path Mutable        | WARN  | EXTERNAL | ["SECURITY"] | Detects functions where the search_path parameter is not set.               | Function \`public.get_chat_history\` has a role mutable search_path                                                                      | https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable         | {"name":"get_chat_history","type":"function","schema":"public"}         | function_search_path_mutable_public_get_chat_history_a8fdc08557d5c92622615f6658e12b0a         |
| function_search_path_mutable    | Function Search Path Mutable        | WARN  | EXTERNAL | ["SECURITY"] | Detects functions where the search_path parameter is not set.               | Function \`pg_temp_12.pg_get_coldef\` has a role mutable search_path                                                                     | https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable         | {"name":"pg_get_coldef","type":"function","schema":"pg_temp_12"}        | function_search_path_mutable_pg_temp_12_pg_get_coldef_8873400ae30a41a3b5888b57d3aad0d3        |
| function_search_path_mutable    | Function Search Path Mutable        | WARN  | EXTERNAL | ["SECURITY"] | Detects functions where the search_path parameter is not set.               | Function \`pg_temp_12.pg_get_tabledef\` has a role mutable search_path                                                                   | https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable         | {"name":"pg_get_tabledef","type":"function","schema":"pg_temp_12"}      | function_search_path_mutable_pg_temp_12_pg_get_tabledef_bb004151cfefe8af0ce716b8589883f5      |
| auth_leaked_password_protection | Leaked Password Protection Disabled | WARN  | EXTERNAL | ["SECURITY"] | Leaked password protection is currently disabled.                           | Supabase Auth prevents the use of compromised passwords by checking against HaveIBeenPwned.org. Enable this feature to enhance security. | https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection | {"type":"auth","entity":"Auth"}                                         | auth_leaked_password_protection                                                               |
| auth_insufficient_mfa_options   | Insufficient MFA Options            | WARN  | EXTERNAL | ["SECURITY"] | This project has too few multi-factor authentication (MFA) options enabled. | Your project has too few MFA options enabled, which may weaken account security. Enable more MFA methods to enhance security.            | https://supabase.com/docs/guides/auth/auth-mfa                                                           | {"type":"auth","entity":"Auth"}                                         | auth_insufficient_mfa_options   
