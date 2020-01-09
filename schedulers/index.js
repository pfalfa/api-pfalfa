const cron = require('cron')
const { api } = require('../utils')
const { Dapps } = require('../models')

const events = 60
const cronjob = new cron.CronJob(`*/${events} * * * * *`, async () => {
  try {
    const dappsPfalfa = await getDappsPfalfa()
    const dappsMachine = await getDappsDev()

    syncDappsMachine(dappsPfalfa, dappsMachine)
    syncDappsPfalfa(dappsPfalfa, dappsMachine)
  } catch (error) {
    console.error(`Schedule Error.\n${error.message}`)
  }
})

async function syncDappsMachine(dappsPfalfa, dappsMachine) {
  dappsMachine.map(async dm => {
    const dpi = dappsPfalfa.findIndex(i => i.dappUid === dm.uid && i.name === dm.name)
    if (dpi < 0 && dm.name !== 'kubernetes') {
      const { status } = await api.get(api.host.dev, `dapps/${dm.name}/delete`)
      console.log(`DApp name ${dm.name} deleted ${status === 'success' ? 'successfully' : 'fail'}`)
    }
  })
}

async function syncDappsPfalfa(dappsPfalfa, dappsMachine) {
  dappsPfalfa.map(async dp => {
    const dmi = dappsMachine.findIndex(i => i.uid === dp.dappUid && i.name === dp.name)
    if (dmi < 0) {
      const params = { id: dp.id }
      Dapps.del(params, err => {
        console.log(`DApp name ${dp.name} deleted ${!err ? 'successfully' : 'fail'}`)
      })
    } else {
      const dm = dappsMachine[dmi]
      const params = { id: dp.id }
      const exp = dm.ipPublic ? 'set gunDb = :g, dappStatus = :s, ipPublic = :i' : 'set gunDb = :g, dappStatus = :s'
      const att = dm.ipPublic ? { ':g': dm.gunDb, ':s': dm.status, ':i': dm.ipPublic } : { ':g': dm.gunDb, ':s': dm.status }
      Dapps.put(params, exp, att, err => {
        console.log(`DApp name ${dp.name} updated ${!err ? 'successfully' : 'fail'}`)
      })
    }
  })
}

async function getDappsPfalfa() {
  return new Promise((resolve, reject) => {
    const params = {}
    Dapps.scan(params, (err, data) => {
      if (err) return reject(err)
      return resolve(data && data.Items)
    })
  })
}

async function getDappsDev() {
  return new Promise((resolve, reject) => {
    api
      .get(api.host.dev, 'dapps/list')
      .then(resp => {
        const { status, data } = resp
        if (status === 'success') {
          const { items } = data
          const datas =
            items.length > 0 &&
            items.map(item => {
              const { metadata, spec, status } = item
              const ingress = status.loadBalancer && status.loadBalancer.ingress
              return {
                uid: metadata.uid,
                name: metadata.name,
                gunDb: `${spec.clusterIP}:${spec.ports[0].port}/gun`,
                status: ingress ? 'active' : 'pending',
                ipPublic: ingress ? ingress[0].ip : null,
              }
            })
          return resolve(datas)
        } else return resolve([])
      })
      .catch(error => reject('Error Get Dapps Dev', error.message))
  })
}

function start() {
  cronjob.start()
  console.log(`Start Scheduler with Events Every ${events} Seconds`)
}

function stop() {
  cronjob.stop()
  console.log('Close Scheduler')
}

module.exports = scheduler = { start, stop }
