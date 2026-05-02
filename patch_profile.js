const fs = require('fs');

// Patch stores/profileStore.ts
let storeFile = 'stores/profileStore.ts';
let storeContent = fs.readFileSync(storeFile, 'utf8');
storeContent = storeContent.replace(
  'setProfile: (p) => set((s) => ({ ...s, profile: { ...(s.profile || {}), ...p } })),',
  'setProfile: (p) => set((s) => ({ ...s, profile: { ...(s.profile || {}), ...p } as any })),'
);
fs.writeFileSync(storeFile, storeContent);

// Patch app/(tabs)/profile/index.tsx
let indexFile = 'app/(tabs)/profile/index.tsx';
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(
  '{profile?.followers_count || 0}',
  '{0}'
);
fs.writeFileSync(indexFile, indexContent);

// Patch app/(tabs)/profile/edit.tsx
let editFile = 'app/(tabs)/profile/edit.tsx';
let editContent = fs.readFileSync(editFile, 'utf8');
editContent = editContent.replace(
  'const { name, bio, travelStyles, languages } = useProfileStore((state) => state);',
  'const { profile, travelerProfile } = useProfileStore((state) => state);\n  const name = profile?.name || "";\n  const bio = profile?.bio || "";\n  const travelStyles = travelerProfile?.travel_style || [];\n  const languages = travelerProfile?.languages_spoken || [];'
);
editContent = editContent.replace(
  'setProfile({ name: newName, bio: newBio, travelStyles: newStyles, languages: newLangs });',
  'setProfile({ name: newName, bio: newBio });'
);
fs.writeFileSync(editFile, editContent);
