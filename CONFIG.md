# KasukabeTsumugi Homepage

## Configuration

This file contains configuration options for the homepage.

### GitHub Settings

- Username: baendlorel
- Repository: baendlorel.github.io

### Features Enabled

- [x] Automatic repository fetching
- [x] NPM package detection
- [x] Real-time search
- [x] Responsive design
- [x] Dark theme
- [x] GitHub Pages deployment

### API Endpoints Used

- GitHub API: `https://api.github.com/users/baendlorel/repos`
- NPM Registry: `https://registry.npmjs.org/{package-name}`

### Deployment

- Platform: GitHub Pages
- Method: GitHub Actions
- Trigger: Push to main branch

### Local Development

To run locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Then visit http://localhost:8000
```
