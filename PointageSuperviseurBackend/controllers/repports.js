const repportsQueries = require('../models/repports')
const PDFDocument = require('pdfkit')
const path = require('path');
const dayjs = require('dayjs')



exports.getNbTotal = async (req, res) => {
    const nb = await repportsQueries.getNbTotalQuery(req.body)
    res.status(200).json(nb)
}

exports.getRepportsBySup = async (req, res) => {
    const nb = await repportsQueries.getRepportsBySup(req.body)
    res.status(200).json(nb)
}

exports.getPDFData = async (req, res) => {
    const dir = path.join(__dirname, '/logo.jpg')
    const doc = new PDFDocument()
    filename = encodeURIComponent('rapports_pointage') + '.pdf'
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"')
    res.setHeader('Content-type', 'application/pdf')
    
    
    doc.image(dir, 210, 0, { width: 150 })
    
    doc
        .fillColor('#26ad90')
        .font('Times-Bold')
        .fontSize(18)
        .text('Pointage superviseurs', 210, 90, { bold: true })
    
    doc
    .fillColor('#000')
        .font('Times-Roman')
        .fontSize(12)
        .text(`Période: ${dayjs(req.body.startDate).format('DD/MM/YYYY')} - ${dayjs(req.body.endDate).format('DD/MM/YYYY')}`,
            210, 115, { bold: true })
 
    let tableY = 150;
    const prenonX = 25;
    const nomX = 100;
    const contactX = 175;
    const residenceX = 250;
    const statutX = 325;
    const nbreX = 410;
    const montantX = 450;
    doc
    .font('Times-Bold')
    .fontSize(12)
    .text('Prénom', prenonX, tableY, {bold: true})
    .text('Nom', nomX, tableY, {bold: true})
    .text('Contact', contactX, tableY, {bold: true})
    .text('Résidence', residenceX, tableY, {bold: true})
    .text('Statut', statutX, tableY, {bold: true})
    .text('Jours', nbreX, tableY, {bold: true})
    .text('Montant', montantX, tableY, {bold: true})
    
    doc.moveTo(20,tableY+15)
    .lineTo(550,tableY+15)
    .stroke()

    const items = await repportsQueries.getPDFData(req.body)
    let i = 0
    let index = 1


    for (i = 0; i < items.length; i++) {
        const item = items[i]
        const y = tableY + (index * 25)
        if (y > 650) {
            index = 0;
            tableY = 20;
            doc.addPage();
          }
        const montant = item.daysInRange * 3333.4
        const prenoms = item.prenom.split(" ")
        const prenom = prenoms[prenoms.length - 1]
        index++;

        doc
            .font('Times-Roman')
            .fontSize(12)
            .text(prenom, prenonX, y)
            .text(item.nom, nomX, y)
            .text(item.numero, contactX, y)
            .text(item.residence, residenceX, y)
            .text(item.statut, statutX, y)
            .text(item.daysInRange, nbreX, y)
            .text(parseInt(montant), montantX, y)
    doc.moveTo(20,y+15)
    .lineTo(550,y+15)
    .stroke()
           
    }
    
    doc.end()    
    doc.pipe(res)
}