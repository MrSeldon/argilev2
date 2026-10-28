import json, os, sys
sys.path.insert(0, "scripts/images")
from common import SCR as S

os.makedirs(S + 'batches', exist_ok=True)
os.makedirs(S + 'results', exist_ok=True)


def slim(x, f):
    d = {k: x.get(k) for k in ['id', 'name', 'type', 'website', 'description', 'deadline', 'cost',
                               'application', 'funding', 'status', 'lastVerified'] if x.get(k) is not None}
    d['file'] = f
    return d


idx = json.load(open('data/opportunities/index.json'))['opportunities']
special = ('grant', 'scholarship', 'fellowship', 'apprenticeship', 'mentorship', 'workshop')
order = sorted(idx, key=lambda x: (x['type'] not in special, x['type']))
n = 6
per = -(-len(order) // n)
for i in range(n):
    part = order[i * per:(i + 1) * per]
    json.dump([slim(x, 'index') for x in part], open(S + 'batches/idx%d.json' % (i + 1), 'w'))
    print(i + 1, len(part), part[0]['type'], part[-1]['type'])
sf = json.load(open('data/opportunities/sf-bay.json'))
co = json.load(open('data/opportunities/colombia.json'))
json.dump([slim(x, 'sf-bay') for x in sf], open(S + 'batches/sf.json', 'w'))
json.dump([slim(x, 'colombia') for x in co], open(S + 'batches/co.json', 'w'))
