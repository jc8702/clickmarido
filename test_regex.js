const url = 'postgresql://postgres.ydfoplwjidtrfkibgcvi:Millena%40%402017%40%40@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
let connectionString = url;
if (connectionString && connectionString.includes('pooler.supabase.com')) {
  const match = connectionString.match(/postgres\.([a-z0-9]+):/);
  if (match) {
    const ref = match[1];
    connectionString = connectionString
      .replace(postgres. + ref, 'postgres')
      .replace(/aws-\d+-[a-z0-9-]+\.pooler\.supabase\.com:\d+/, db. + ref + .supabase.co:5432)
      .replace('?pgbouncer=true', '');
  }
}
console.log(connectionString);
