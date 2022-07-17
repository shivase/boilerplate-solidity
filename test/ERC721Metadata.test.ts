/* eslint-disable node/no-missing-import */
import { ethers } from 'hardhat';
import { expect } from './chai-setup';
import { ERC721Metadata } from '../typechain';

describe('ERC721Metadata Contract', () => {
  let metadata: ERC721Metadata;
  const name: string = 'name';
  const symbol: string = 'symbol';

  beforeEach(async () => {
    const contract = await ethers.getContractFactory('ERC721Metadata');
    metadata = await contract.deploy(name, symbol);
    await metadata.deployed();
  });

  it('should return name', async () => {
    const retName = await metadata.name();
    await expect(retName).to.equal(name);
  });

  it('should return symbol', async () => {
    const retSymbol = await metadata.symbol();
    await expect(retSymbol).to.equal(symbol);
  });
});
