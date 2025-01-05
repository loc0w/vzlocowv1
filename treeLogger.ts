// treeLogger.ts
import fs from 'fs';
import path from 'path';

/**
 * Verilen 'dirPath' (klasör yolu) içindeki dosya/klasörleri özyinelemeli
 * olarak konsola ağaç formatında yazar.
 *
 * @param dirPath  Yazdırılmak istenen dizin yolu
 * @param prefix   Her satırın başına gelecek boşluk ya da semboller
 */
function printDirectoryTree(dirPath: string, prefix = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    // Son entry ise '└──', değilse '├──' gibi bir sembol kullanacağız
    const connector = isLast ? '└── ' : '├── ';

    // Gösterilecek yol
    const fullPath = path.join(dirPath, entry.name);
    const newPrefix = prefix + (isLast ? '    ' : '│   ');

    // Klasör mü, yoksa dosya mı?
    if (entry.isDirectory()) {
      console.log(`${prefix}${connector}${entry.name}/`);
      // Alt klasörleri de geziyoruz
      printDirectoryTree(fullPath, newPrefix);
    } else {
      console.log(`${prefix}${connector}${entry.name}`);
    }
  });
}

// Manuel olarak test etmek isterseniz:
const targetPath = path.join(__dirname, '..'); // Örnek: bir üst klasörü loglamak
console.log(`Dosya yapısı: ${targetPath}\n`);
printDirectoryTree(targetPath);
